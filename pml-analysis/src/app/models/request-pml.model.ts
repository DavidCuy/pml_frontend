export class RequestPML {
  /**
   * Crea una instancia de RequestPML
   * @param {string} sistema Sistema
   * @param {string} proceso Proceso
   * @param {string} beginDate Fecha de inicio
   * @param {string} endDate Fecha de fin
   * @param {any[]} nodos Lista de nodos
   * @memberof RequestPML
   */
  constructor(
    public sistema: string,
    public proceso: string,
    public beginDate: string,
    public endDate: string,
    public nodos: any[],
  ) { }
}
