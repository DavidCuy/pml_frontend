import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PmlDataService } from '../../services/pml-data.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Town } from '../../models/town.model';
import { State } from '../../models/state.model';
import { InegiDataService } from '../../services/inegi-data.service';
import { NodeMData } from '../../models/nodeM.model';
import { ExcelService, ExcelSheet } from '../../services/excel.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare function init_plugins();
declare function loader_show(inputText: string);

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.css']
})
export class ExportDataComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollViewport', {static: false})
  public viewPort: CdkVirtualScrollViewport;

  public rows: {col1: number, col2: string}[] = [];

  public get inverseOfTranslation(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentTransform']) {
      return '0';
    }
    const transform = this.viewPort['_renderedContentTransform'];
    return '-' + transform.substr(11, transform.length - 14) + 'px';
  }

  form: FormGroup;

  pageTitle: string = '';
  breadcrumb: string[] = [];
  showTableData: NodeMData[] = [];
  tableData: NodeMData  [] = [];

  states: State[] = [];
  towns: Town[] = [];

  beginDate_str: string = '';
  endDate_str: string = '';
  proccess: string = '';

  showFormLoader: boolean = false;

  avg_pml: number =  0;
  avg_pml_ene: number =  0;
  avg_pml_per: number =  0;
  avg_pml_cng: number =  0;

  constructor(public pmlService: PmlDataService,
              public inegiService: InegiDataService,
              public excelService: ExcelService,
              private _activeRoute: ActivatedRoute,
              private _titleService: Title) { }

  ngOnInit() {
    loader_show('Cargando...');

    this.form = new FormGroup({
      proccess: new FormControl('', [
        Validators.required
      ]),
      state: new FormControl('', [
        Validators.required
      ]),
      town: new FormControl('', [
        Validators.required
      ]),
      beginDate: new FormControl('', [
        Validators.required
      ]),
      endDate: new FormControl('', [
        Validators.required
      ])
    });

    this._activeRoute.data.subscribe(f => {
      this.breadcrumb = f.path.split('.');

      this.pageTitle = f.title;
      this._titleService.setTitle(this.pageTitle);
    });

    this.inegiService.getAllStates().subscribe((resp) => {
      this.states = resp;
      init_plugins();
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

  selectedStateChange() {
    const stateId = this.form.controls.state.value;
    loader_show('Cargando municipios...');
    this.inegiService.getTownsByState(parseInt(stateId, 10)).subscribe((resp) => {
      this.towns = resp;
      init_plugins();
    });
  }

  sendRequest() {
    const request: any = {
      proceso: this.form.controls.proccess.value,
      estado: parseInt(this.form.controls.state.value, 10),
      municipio: parseInt(this.form.controls.town.value, 10),
      inicio: this.form.controls.beginDate.value,
      fin: this.form.controls.endDate.value
    };
    this.showFormLoader = true;
    this.pmlService.getNodeM(request).subscribe((resp) => {
      this.showFormLoader = false;
      this.tableData = resp;
      this.showTableData = this.tableData;

      let pml_array = this.showTableData.map(node => node.pml);
      this.avg_pml = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_ene);
      this.avg_pml_ene = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_per);
      this.avg_pml_per = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_cng);
      this.avg_pml_cng = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;
    });
  }

  filterTableDate() {
    this.showTableData = this.tableData;

    if (this.beginDate_str || this.beginDate_str.length > 0) {
      const beginDate = new Date(Date.parse(this.beginDate_str));
      beginDate.setDate(beginDate.getDate() + 1);
      const endDate = new Date(Date.parse(this.endDate_str));
      endDate.setDate(endDate.getDate() + 1);
      this.showTableData = this.showTableData.filter(data => beginDate <= data.datetime && data.datetime <= endDate);

      let pml_array = this.showTableData.map(node => node.pml);
      this.avg_pml = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_ene);
      this.avg_pml_ene = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_per);
      this.avg_pml_per = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;

      pml_array = this.showTableData.map(node => node.pml_cng);
      this.avg_pml_cng = pml_array.reduce((a, b) => a + b, 0) / pml_array.length;
    }
  }

  exportData() {
    const selectedState = parseInt(this.form.controls.state.value, 10);
    const selectedTown =  parseInt(this.form.controls.town.value, 10);
    const estado = this.states.find(estado => estado.id === selectedState);
    const municipio = this.towns.find(municipio => municipio.Inegi_id === selectedTown);
    const exportData: ExcelSheet[] = [
      {
        name: 'data',
        data: this.showTableData
      },
      {
        name: 'promedios',
        data: [
          {
            pml: this.avg_pml,
            pml_ene: this.avg_pml_ene,
            pml_per: this.avg_pml_per,
            pml_cng: this.avg_pml_cng
          }
        ]
      }
    ];
    this.excelService.exportMultpleSheetsExcel(exportData, `nodoM_${estado.Nombre}_${municipio.Nombre}`);
    // this.excelService.exportAsExcelFile(this.showTableData, `nodoM_${estado.Nombre}_${municipio.Nombre}`);
  }

}
