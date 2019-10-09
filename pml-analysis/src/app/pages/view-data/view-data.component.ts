import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PmlDataService } from '../../services/pml-data.service';
import { Node } from '../../models/node.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PMLData } from '../../models/pml-data.model';
import { ExcelService } from '../../services/excel.service';

declare function init_plugins();
declare function loader_show(inputText: string);

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit, AfterViewInit {

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

  pageTitle: string = '';
  breadcrumb: string[] = [];
  data: any = { };
  showNodes: Node[] = [];
  showTableData: PMLData[] = [];
  tableData: PMLData[] = [];
  selected_Node: Node = null;

  systemFilter: string = '';
  regionFilter: string = '';
  chargeFilter: string = '';
  transmitionFilter: string = '';
  distributionFilter: string = '';
  stateFilter: string = '';
  cityFilter: string = '';

  beginDate_str: string = '';
  endDate_str: string = '';
  proccess: string = '';

  showFormLoader: boolean = false;

  constructor(public pmlService: PmlDataService,
              public excelService: ExcelService,
              private _activeRoute: ActivatedRoute,
              private _titleService: Title) { }

  ngOnInit() {
    loader_show('Cargando...');
    this._activeRoute.data.subscribe(f => {
      this.breadcrumb = f.path.split('.');

      this.pageTitle = f.title;
      this._titleService.setTitle(this.pageTitle);
    });

    this.pmlService.getStorageData().subscribe((resp) => {
      init_plugins();
      this.data = resp;
      this.showNodes = resp.nodes;
    });
  }

  selectedNode(node: Node, resume) {
    this.selected_Node = node;
    this.beginDate_str = '';
    this.endDate_str = '';
    this.proccess = '';
    this.data.resume.map(node_resume => node_resume.active = false);
    resume.active = true;

    const query: any = {
      'clave': node.str_CLAVE
    };
    this.showFormLoader = true;
    this.pmlService.getNodeData(query).subscribe((resp) => {
      this.tableData = resp;
      this.showTableData = this.tableData;
      this.showFormLoader = false;
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
      this.beginDate_str = $('#beginDate').val().toString();
      this.filterTableDate();
    });

    $('#endDate').change(() => {
      this.endDate_str = $('#endDate').val().toString();
      this.filterTableDate();
    });
  }

  filterChange() {
    this.showNodes = this.data.nodes;
    this.showNodes = this.showNodes.filter(node =>
      node.str_SISTEMA.toUpperCase().includes(this.systemFilter.toLocaleUpperCase()));
    this.showNodes = this.showNodes.filter(node =>
      node.str_REGION_DE_TRANSMISION.toUpperCase().includes(this.regionFilter.toLocaleUpperCase()));
    this.showNodes = this.showNodes.filter(node =>
      node.str_REGION_DE_TRANSMISION.toUpperCase().includes(this.transmitionFilter.toLocaleUpperCase()));
    this.showNodes = this.showNodes.filter(node =>
      node.str_ZONA_DE_DISTRIBUCION.toUpperCase().includes(this.distributionFilter.toLocaleUpperCase()));
    this.showNodes = this.showNodes.filter(node =>
      node.str_INEGI_ENTIDAD_FEDERATIVA.toUpperCase().includes(this.stateFilter.toLocaleUpperCase()));
    this.showNodes = this.showNodes.filter(node =>
        node.str_INEGI_MUNICIPIO.toUpperCase().includes(this.cityFilter.toLocaleUpperCase()));
  }

  filterTableDate() {
    this.showTableData = this.tableData;
    if (this.proccess || this.proccess.length > 0) {
      this.showTableData = this.showTableData.filter(data => data.proceso.toLocaleUpperCase() === this.proccess.toLocaleUpperCase());
    }

    if (this.beginDate_str || this.beginDate_str.length > 0) {
      const beginDate = new Date(Date.parse(this.beginDate_str));
      beginDate.setDate(beginDate.getDate() + 1);
      const endDate = new Date(Date.parse(this.endDate_str));
      endDate.setDate(endDate.getDate() + 1);
      this.showTableData = this.showTableData.filter(data => beginDate <= data.fecha && data.fecha <= endDate);
    }
  }

  exportData() {
    this.excelService.exportAsExcelFile(this.showTableData, `nodoP_${this.selected_Node.str_CLAVE}`);
  }

  findTotal(node_clave) {
    const resume = this.data.resume.find((node) => node._id === node_clave);
    return resume;
  }

}
