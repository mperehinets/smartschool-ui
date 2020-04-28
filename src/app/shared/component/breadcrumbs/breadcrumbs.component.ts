import {Breadcrumb} from '../../model/Breadcrumb';

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumbs: Breadcrumb[];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root));
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data[BreadcrumbsComponent.ROUTE_DATA_BREADCRUMB];
      if (label !== null && label !== undefined) {
        breadcrumbs.push({label: this.translate.instant(label), url});
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

}

