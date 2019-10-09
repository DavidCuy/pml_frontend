export class Town {
  /**
   * Crea una instancia del municipio
   * @param {number} id Id de la base de datos
   * @param {number} Estado_id Id del estado
   * @param {number} Inegi_id Id INEGI del municipio
   * @param {string} Nombre Nombre del municipio
   * @memberof Town
   */
  constructor(
    public id:        number,
    public Estado_id: number,
    public Inegi_id:  number,
    public Nombre:    string
  ) {}
}
