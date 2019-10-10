import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: []
})
export class NavigationComponent implements OnInit {

  @Input() title: string;
  @Input() breadcrumb: string[];

  constructor() { }

  ngOnInit() {
  }

}
