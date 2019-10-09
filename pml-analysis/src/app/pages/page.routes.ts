import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DownloadDataComponent } from './download-data/download-data.component';
import { ErrorLogsComponent } from './error-logs/error-logs.component';
import { ExportDataComponent } from './export-data/export-data.component';
import { NodesComponent } from './nodes/nodes.component';
import { ViewDataComponent } from './view-data/view-data.component';

const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'descarga', component: DownloadDataComponent, data: { title: 'PML analysis - Descarga', path: 'PML.Descarga' } },
      { path: 'visualizar', component: ViewDataComponent, data: { title: 'PML analysis - Ver', path: 'PML.Ver' } },
      { path: 'nodos', component: NodesComponent, data: { title: 'PML analysis - Nodos', path: 'PML.Nodos' } },
      { path: 'exportar', component: ExportDataComponent, data: { title: 'PML analysis - Exportar', path: 'PML.Exportar' } },
      { path: 'errorLog', component: ErrorLogsComponent, data: { title: 'PML analysis - Error Log', path: 'PML.Error Log' } },
      { path: '', pathMatch: 'full', redirectTo: '/notFound' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(PAGES_ROUTES, { useHash: true })
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
