export class NodeMData {
  /**
   * Crea una instancia de NodeMData
   * @param {Date} datetime Tipo de dato fecha de la consulta del nodo
   * @param {string} fecha Fecha de consulta
   * @param {string} hora Hora de consulta
   * @param {number} pml Valor de pml
   * @param {number} pml_ene Valor de pml
   * @param {number} pml_per Valor de pml
   * @param {number} pml_cng Valor de pml
   * @memberof NodeMData
   */
  constructor(
    public datetime: Date,
    public fecha: string,
    public hora: string,
    public pml: number,
    public pml_ene: number,
    public pml_per: number,
    public pml_cng: number
  ) { }
}
