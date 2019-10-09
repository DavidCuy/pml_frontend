export class PMLData {
  /**
   * Crea una instancia de PMLData
   * @param {string} _id Id de la base de datos No relacional
   * @param {string} clave Clave del nodo
   * @param {string} nombre Nombre del nodo
   * @param {string} proceso Proceso del nodo
   * @param {string} sistema Sistema en el que se encuentra el nodo
   * @param {string} area Area
   * @param {Date} fecha Fecha de consulta
   * @param {number} hora Hora de consulta
   * @param {number} pml Valor de pml
   * @param {number} pml_ene Valor de pml
   * @param {number} pml_per Valor de pml
   * @param {number} pml_cng Valor de pml
   * @memberof PMLData
   */
  constructor(
    public _id: string,
    public clave: string,
    public nombre: string,
    public proceso: string,
    public sistema: string,
    public area: string,
    public fecha: Date,
    public hora: number,
    public pml: number,
    public pml_ene: number,
    public pml_per: number,
    public pml_cng: number
  ) { }
}
