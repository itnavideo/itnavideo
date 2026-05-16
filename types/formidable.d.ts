declare module 'formidable' {
  import type { IncomingMessage } from 'http';

  export type File = {
    filepath: string;
    originalFilename?: string | null;
    mimetype?: string | null;
  };

  export type Fields = Record<string, string | string[] | undefined>;
  export type Files = Record<string, File | File[] | undefined>;

  type Part = {
    name?: string;
    mimetype?: string | null;
  };

  type Options = {
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    multiples?: boolean;
    filter?: (part: Part) => boolean;
  };

  type Form = {
    parse: (
      req: IncomingMessage,
      callback: (error: Error | null, fields: Fields, files: Files) => void,
    ) => void;
  };

  export default function formidable(options?: Options): Form;
}
