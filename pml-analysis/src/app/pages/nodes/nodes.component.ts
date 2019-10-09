import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { NodeService } from '../../services/node.service';
import { Node } from '../../models/node.model';

declare function init_plugins();
declare function loader_show(text_loader);

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {

  pageTitle: string = '';
  breadcrumb: string[] = [];
  nodes: Node[] = [];

  /**
   * Opciones de la tabla [Datatable]
   *
   * @type {DataTables.Settings}
   * @memberof UsersComponent
   */
  dtOptions: DataTables.Settings = {};

  /**
   * Disparador de cambios de la tabla [Datatable]
   *
   * @type {Subject}
   * @memberof UsersComponent
   */
  // @ts-ignore
  dtTrigger: Subject = new Subject();

  constructor(public nodeService: NodeService,
              private _activeRoute: ActivatedRoute,
              private _titleService: Title) { }

  ngOnInit() {
    loader_show('Cargando...');

    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
      }
    };

    this._activeRoute.data.subscribe(f => {
      this.breadcrumb = f.path.split('.');

      this.pageTitle = f.title;
      this._titleService.setTitle(this.pageTitle);
    });

    this.nodeService.getAllNodes().subscribe(resp => {
      this.nodes = resp;
      this.dtTrigger.next();
      init_plugins();
    });
  }

}
