import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './page.routes';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { PagesComponent } from './pages.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { DownloadDataComponent } from './download-data/download-data.component';
import { ExportDataComponent } from './export-data/export-data.component';
import { ErrorLogsComponent } from './error-logs/error-logs.component';
import { NodesComponent } from './nodes/nodes.component';
import { FullpageLoaderComponent } from '../shared/fullpage-loader/fullpage-loader.component';
import { NavigationComponent } from '../shared/navigation/navigation.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewDataComponent } from './view-data/view-data.component';



@NgModule({
  declarations: [
    PagesComponent,
    NavbarComponent,
    SidebarComponent,
    NavigationComponent,
    FullpageLoaderComponent,
    FooterComponent,
    DownloadDataComponent,
    ExportDataComponent,
    ErrorLogsComponent,
    NodesComponent,
    ViewDataComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
