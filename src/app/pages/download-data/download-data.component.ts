import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import 'bootstrap-datepicker';
import { NodeService } from '../../services/node.service';
import { Node } from '../../models/node.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { RequestPML } from '../../models/request-pml.model';
import Swal from 'sweetalert2';
import { PmlDataService } from '../../services/pml-data.service';

declare function init_plugins();
declare function loader_show(loader_text);

interface JQuery {
  // tslint:disable-next-line:ban-types
  datepicker(options?: any, callback?: Function) : any;
}

@Component({
  selector: 'app-download-data',
  templateUrl: './download-data.component.html',
  styleUrls: ['./download-data.component.css']
})
export class DownloadDataComponent implements OnInit, AfterViewInit {
  filters: any[] = [{
    name: 'Todos',
    value: 'all'
  }, {
    name: 'Control regional',
    value: 'region'
  }, {
    name: 'Zona de carga',
    value: 'charge'
  }, {
    name: 'Zona de operación de transmisión',
    value: 'transmition'
  }, {
    name: 'Zona de distribución',
    value: 'distribution'
  }, {
    name: 'Estado',
    value: 'state'
  }, {
    name: 'Municipio',
    value: 'city'
  }];

  form: FormGroup;

  pageTitle: string = '';
  breadcrumb: string[] = [];
  nodes: Node[] = [];
  showNodes: Node[] = [];
  selectedNodes: Node[] = [];

  constructor(public nodeService: NodeService,
              public requestService: RequestService,
              public pmlService: PmlDataService,
              private _activeRoute: ActivatedRoute,
              private _titleService: Title) { }

  ngOnInit() {
    loader_show('Cargando...');
    this._activeRoute.data.subscribe(f => {
      this.breadcrumb = f.path.split('.');

      this.pageTitle = f.title;
      this._titleService.setTitle(this.pageTitle);
    });

    this.nodeService.getAllNodes().subscribe(resp => {
      init_plugins();
      this.nodes = resp;
      this.showNodes = this.nodes;
    });

    this.form = new FormGroup({
      system: new FormControl('', [
        Validators.required
      ]),
      proccess: new FormControl('', [
        Validators.required
      ]),
      beginDate: new FormControl('', [
        Validators.required
      ]),
      endDate: new FormControl('', [
        Validators.required
      ]),
      filter_selected: new FormControl('all'),
      filter_text: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    $('#date-range').datepicker({
      language: 'es',
      todayHighlight: true,
      todayBtn: true,
      autoclose: true,
      format: 'yyyy-mm-dd'
    });

    $('#beginDate').change(() => {
      this.form.controls.beginDate.setValue($('#beginDate').val());
    });

    $('#endDate').change(() => {
      this.form.controls.endDate.setValue($('#endDate').val());
    });
  }

  systemChange() {
    this._filter_nodes();
  }

  filterSearch(searchText: string) {
    this.form.controls.filter_text.setValue(searchText);
    this._filter_nodes();
  }

  addSelectedNode(clave) {
    if (!clave) {
      return;
    }
    const selectedNode: Node = this.showNodes.find(node => node.str_CLAVE === clave);
    this.selectedNodes.push(selectedNode);
    this.showNodes = this.showNodes.filter(node => !this.selectedNodes.includes(node));
  }

  removeSelectedNode(clave) {
    const selectedNode: Node = this.selectedNodes.find(node => node.str_CLAVE === clave);
    this.showNodes.unshift(selectedNode);
    this.selectedNodes = this.selectedNodes.filter(node => node.str_CLAVE !== clave);
    this.showNodes = this.showNodes.filter(node => !this.selectedNodes.includes(node));
  }

  addAllNodes() {
    this.showNodes.forEach((node) => {
      this.selectedNodes.push(node);
    });
    this.showNodes = [];
  }

  removeAllNodes() {
    this.selectedNodes.forEach((node) => {
      this.showNodes.push(node);
    });
    this.selectedNodes = [];
  }

  async sendRequest() {
    const sendData = {
      system: this.form.controls.system.value,
      proccess: this.form.controls.proccess.value,
      beginDate: this.form.controls.beginDate.value,
      endDate: this.form.controls.endDate.value,
      nodes: this.selectedNodes.map((node) => node.str_CLAVE),
      /*full_nodes: this.selectedNodes.map((node) => {
        return {
          clave: node.str_CLAVE,
          zona_de_carga: node.str_ZONA_DE_CARGA,
          id_inegi_estado: node.int_INEGI_CLAVE_ENTIDAD_FEDERATIVA,
          id_inegi_municipio: node.int_INEGI_CLAVE_MUNICIPIO
        };
      }),*/
    };

    const validate = await Swal.fire({
      title: 'Antes de comenzar',
      text: '¿Desea validar la información existente? Este proceso puede tardar más que alas peticiones',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((resp) => {
      return resp.value ? true : false;
    });

    loader_show(validate ? 'Validando información...' : 'Preparando petición...');
    let requestData: RequestPML[] = [];
    if (validate) { requestData = await this.requestService.getRequestDate(sendData);
    } else { requestData = await this.requestService.prepareRequest(sendData); }
    let totalRequest: number = 0;
    requestData.forEach((request) => {
      let tempNodeArray: any[] = [];

      const bigTempArray: any[] = [];
      request.nodos.forEach((node, index) => {
        const full_node = this.selectedNodes.find((f_node) => f_node.str_CLAVE === node);
        tempNodeArray.push(full_node);

        if ((index + 1) % 20 === 0 || (index + 1) === request.nodos.length) {
          bigTempArray.push(tempNodeArray);

          tempNodeArray = [];
        }
      });
      totalRequest += bigTempArray.length;
      request.nodos = bigTempArray;
    });

    init_plugins();

    if (totalRequest <= 0) {
      Swal.fire({
        title: 'Atencion',
        text: `No hay datos pendientes para el rango especificado. Para más información en la sección de exportar`,
        type: 'info',
        confirmButtonText: 'OK',
      });
      return;
    }

    let timerInterval: any;
    let lefTime: number = 30;
    Swal.fire({
      title: 'Atencion',
      html: `Se realizarán <b>${totalRequest}</b> peticiones. ¿Desea continuar? <br>` +
            `<small>Se ejecutará en <strong>${lefTime}</strong> segundos</small>`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      timer: 30000,
      onBeforeOpen: () => {
        timerInterval = setInterval(() => {
          lefTime -= 1;
          Swal.getContent().querySelector('strong').textContent = lefTime.toString();
        }, 1000);
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(async (result) => {
      if (result.value || result.dismiss === Swal.DismissReason.timer) {
        const initTime: Date = new Date();
        $('#taskbar').text('Porcentaje de avance: 0%');
        $('#taskbar').removeClass('completed');
        $('#taskbar').removeClass('hidden');

        try {
          const data = await this._execut_request(requestData, totalRequest);
          const finishTime: Date = new Date();
          const executionTime = (finishTime.valueOf() - initTime.valueOf()) / 1000;
          data.executionTime = executionTime;
          console.log({
            'results': data
          });
          localStorage.setItem('pml_last_results', JSON.stringify(data));

          $('#taskbar').addClass('completed');
          $('#taskbar').text(`COMPLETADO. Tiempo de ejecución ${Math.round(100 * executionTime) / 100} segundos`);
          console.log(`La peticion de datos tardó ${executionTime} segundos`);

          setTimeout(() => $('#taskbar').addClass('hidden'), 10000 );
        } catch (err) {
          console.error(err);
        }
      }
    });

  }

  private _execut_request(data: RequestPML[], totalRequest: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let success_request: number = 0;
      let error_request: number = 0;
      const new_array: any[] = this._splitToNArray(data, 30);
      new_array.forEach(async (new_data) => {
        for (const request of new_data) {
          for (const nodeArray of request.nodos) {
            const current_request: RequestPML = {
              beginDate: request.beginDate,
              endDate: request.endDate,
              nodos: nodeArray,
              proceso: request.proceso,
              sistema: request.sistema,
            };
            try {
              const resp = await this.pmlService.makePMLrequest(current_request);
              success_request++;
              const percent: number = Math.round(100 * ((success_request + error_request) / totalRequest));
              console.log(`Peticion ${success_request + error_request} de ${totalRequest}`);
              console.log(resp);
              $('#taskbar').text(`Porcentaje de avance: ${percent}%`);
              if ((success_request + error_request) === totalRequest) {
                resolve({
                  num_success: success_request,
                  num_error: error_request
                });
              }
            } catch (err) {
              console.log(`Peticion ${success_request + error_request} de ${totalRequest}`);
              error_request++;
              console.error('OCURRIO UN ERROR', err);
              if ((success_request + error_request) === totalRequest) {
                resolve({
                  num_success: success_request,
                  num_error: error_request
                });
              }
            }
          }
        }
      });
    });
  }

  private _filter_nodes() {
    this.showNodes = [];
    switch (this.form.controls.filter_selected.value) {
      case 'region':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_CENTRO_DE_CONTROL_REGIONAL.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      case 'charge':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_ZONA_DE_CARGA.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      case 'transmition':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_REGION_DE_TRANSMISION.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      case 'distribution':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_ZONA_DE_DISTRIBUCION.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      case 'state':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_INEGI_ENTIDAD_FEDERATIVA.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      case 'city':
        this.showNodes = this.nodes.filter((node) => {
          return node.str_INEGI_MUNICIPIO.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
      default:
        this.showNodes = this.nodes.filter((node) => {
          return node.str_NOMBRE.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase())
                || node.str_CLAVE.toUpperCase().includes(this.form.controls.filter_text.value.toUpperCase());
        });
        break;
    }

    if (this.form.controls.system.value) {
      this.showNodes = this.showNodes.filter((node) => {
        return node.str_SISTEMA === this.form.controls.system.value;
      });
    }

    this.showNodes = this.showNodes.filter(node => !this.selectedNodes.includes(node));
  }

  private _splitToNArray(array, parts): any[] {
    const result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}

}
