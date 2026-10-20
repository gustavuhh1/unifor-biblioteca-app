// Como um tipo de src/shared/types chega do JSON da API: as datas (Date) vêm
// como texto ISO 8601. Use ApiJson<Book> ao tipar uma resposta.
export type ApiJson<T> = T extends Date
  ? string
  : T extends readonly (infer Item)[]
    ? ApiJson<Item>[]
    : T extends object
      ? { [Key in keyof T]: ApiJson<T[Key]> }
      : T
