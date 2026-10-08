const fs = require('fs');
const sampleRate = 16000;
const duration = 2; // seconds
const numSamples = sampleRate * duration;
const buffer = Buffer.alloc(44 + numSamples * 2);

// RIFF chunk descriptor
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);

// fmt sub-chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
buffer.writeUInt16LE(1, 22);  // NumChannels
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
buffer.writeUInt16LE(2, 32);  // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample

// data sub-chunk
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Write sine wave data
for (let i = 0; i < numSamples; i++) {
  const value = Math.round(Math.sin(2 * Math.PI * 440 * i / sampleRate) * 10000);
  buffer.writeInt16LE(value, 44 + i * 2);
}

fs.writeFileSync('jfk.wav', buffer);
console.log('Created jfk.wav');
