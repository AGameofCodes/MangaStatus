export type ProgressCallBackFn = (type: string, progress: number, max: number) => (Promise<void> | void);
export type FinishCallBackFn = () => (Promise<void> | void);

export class Progress {
  readonly progress: ProgressCallBackFn;
  readonly finish: FinishCallBackFn;

  constructor(onProgress: ProgressCallBackFn, onFinish: FinishCallBackFn) {
    this.progress = onProgress;
    this.finish = onFinish;
  }

  async onProgress(type: string, progress: number, max: number): Promise<void> {
    return (this.progress ? this.progress(type, progress, max) : Promise.resolve());
  }

  async onFinished(): Promise<void> {
    return (this.finish ? this.finish() : Promise.resolve());
  }
}