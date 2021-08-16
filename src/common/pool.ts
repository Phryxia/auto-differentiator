interface Initializer<T, P> {
  new (param: P): T
}

export class Pool<DataType, InitParam> {
  private readonly data: { [key: string]: DataType } = {}

  public constructor(
    private readonly initializer: Initializer<DataType, InitParam>
  ) {}

  public get(param: InitParam): DataType {
    const key = `${param}`
    if (!this.data[key]) this.data[key] = new this.initializer(param)
    return this.data[key]
  }
}
