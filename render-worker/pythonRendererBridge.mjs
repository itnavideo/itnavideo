import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureRenderWorkspace } from './renderWorkspace.mjs';

const bridgeDir = ensureRenderWorkspace().processedAssets.pythonBridge;
const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'python_renderer.py');

fs.mkdirSync(bridgeDir, { recursive: true });

export async function buildPythonRenderPlan(payload, options = {}) {
  const requestPath = path.join(bridgeDir, `render_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
  const responsePath = `${requestPath}.out.json`;

  fs.writeFileSync(requestPath, JSON.stringify(payload), 'utf8');

  try {
    await runPython([scriptPath, requestPath, responsePath], options.timeoutMs || 30_000);
    const raw = fs.readFileSync(responsePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed?.filterGraph || !parsed?.videoMap || !parsed?.audioMap) {
      throw new Error('Python renderer returned an invalid render plan.');
    }

    return parsed;
  } finally {
    fs.rmSync(requestPath, { force: true });
    fs.rmSync(responsePath, { force: true });
  }
}

export async function renderPythonVideo(payload, outputPath, options = {}) {
  const requestPath = path.join(bridgeDir, `render_full_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
  const responsePath = `${requestPath}.out.json`;

  fs.writeFileSync(requestPath, JSON.stringify({ ...payload, outputPath }), 'utf8');

  try {
    await runPython([scriptPath, '--render', requestPath, responsePath], options.timeoutMs || 15 * 60 * 1000);
    const raw = fs.readFileSync(responsePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed?.success || !fs.existsSync(outputPath)) {
      throw new Error(parsed?.error || 'Python renderer did not create an output MP4.');
    }

    return parsed;
  } finally {
    fs.rmSync(requestPath, { force: true });
    fs.rmSync(responsePath, { force: true });
  }
}

export async function getPythonRendererHealth() {
  try {
    const pythonPath = getPythonPath();
    const result = await runProcess(pythonPath, ['--version'], 5000);
    const wrappers = await getPythonWrapperHealth(pythonPath);
    return {
      ok: true,
      path: pythonPath,
      version: `${result.stdout || result.stderr}`.trim(),
      planner: fs.existsSync(scriptPath),
      wrappers,
    };
  } catch (error) {
    return {
      ok: false,
      path: getPythonPath(),
      error: error.message,
      planner: fs.existsSync(scriptPath),
    };
  }
}

async function getPythonWrapperHealth(pythonPath) {
  try {
    const script = [
      'import importlib.util, json',
      'data={"ffmpeg_python": importlib.util.find_spec("ffmpeg") is not None, "moviepy": importlib.util.find_spec("moviepy") is not None, "numpy": importlib.util.find_spec("numpy") is not None, "PIL": importlib.util.find_spec("PIL") is not None}',
      'print(json.dumps(data))',
    ].join('; ');
    const result = await runProcess(pythonPath, ['-c', script], 5000);
    return JSON.parse(result.stdout || '{}');
  } catch (error) {
    return { error: error.message };
  }
}

function runPython(args, timeoutMs) {
  return runProcess(getPythonPath(), args, timeoutMs);
}

function runProcess(command, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);

      if (timedOut) {
        reject(new Error(`Python renderer timed out after ${Math.round(timeoutMs / 1000)} seconds.`));
        return;
      }

      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(`Python renderer exited with code ${code}: ${(stderr || stdout).slice(-2000)}`));
    });
  });
}

function getPythonPath() {
  const configuredPythonPath = process.env.PYTHON_PATH?.trim();
  if (configuredPythonPath && commandExists(configuredPythonPath)) return configuredPythonPath;

  const localAppData = process.env.LOCALAPPDATA;
  const candidates = [
    localAppData ? path.join(localAppData, 'Programs', 'Python', 'Python312', 'python.exe') : '',
    localAppData ? path.join(localAppData, 'Programs', 'Python', 'Python313', 'python.exe') : '',
    process.platform === 'win32' ? 'python.exe' : 'python3',
    'python',
  ].filter(Boolean);

  return candidates.find(commandExists) || 'python';
}

function commandExists(command) {
  if (!command) return false;
  if (path.isAbsolute(command) || command.includes(path.sep) || command.includes('/')) {
    return fs.existsSync(command);
  }

  const result = spawnSync(command, ['--version'], { stdio: 'ignore', windowsHide: true });
  return !result.error && result.status === 0;
}
