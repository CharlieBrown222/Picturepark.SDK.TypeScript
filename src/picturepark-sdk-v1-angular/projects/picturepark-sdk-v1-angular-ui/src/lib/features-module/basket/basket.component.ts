import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';

// LIBRARIES
import {
  ContentService, ContentSearchRequest, LifeCycleFilter, BrokenDependenciesFilter,
  ContentSearchType, TermsFilter, fetchAll } from '@picturepark/sdk-v1-angular';
import { PICTUREPARK_UI_CONFIGURATION, PictureparkUIConfiguration, ConfigActions } from '../../configuration';

// COMPONENTS
import { BaseComponent } from '../../shared-module/components/base.component';
import {
  ShareContentDialogComponent
} from '../../features-module/dialog/components/share-content-dialog/share-content-dialog.component';

// SERVICES
import { BasketService } from '../../shared-module/services/basket/basket.service';
import { DownloadFallbackService } from '../../shared-module/services/download-fallback/download-fallback.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'pp-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent extends BaseComponent implements OnInit {

  public basketItems: string[] = [];

  public configActions: ConfigActions;

  @Output()
  public previewItemChange = new EventEmitter<string>();

  constructor(
    @Inject(PICTUREPARK_UI_CONFIGURATION) private pictureParkUIConfig: PictureparkUIConfiguration,
    private contentService: ContentService,
    private basketService: BasketService,
    public dialog: MatDialog,
    private downloadFallbackService: DownloadFallbackService
    ) {

    super();

    const basketSubscription = this.basketService.basketChange.subscribe((items) => this.basketItems = items);
    this.subscription.add(basketSubscription);

  }

  public previewItem(itemId: string): void {
    this.previewItemChange.emit(itemId);
  }

  public downloadItems(): void {
    const contentSearch = fetchAll(req => this.contentService.search(req), new ContentSearchRequest({
      limit: 1000,
      lifeCycleFilter: LifeCycleFilter.ActiveOnly,
      brokenDependenciesFilter: BrokenDependenciesFilter.All,
      searchType: ContentSearchType.MetadataAndFullText,
      debugMode: false,
      filter: new TermsFilter({
        field: 'id',
        terms: this.basketItems
      })
    })).subscribe(data => {
      contentSearch.unsubscribe();
      this.downloadFallbackService.download(data.results);
    });
  }

  public openShareContentDialog(): void {

    const dialogRef = this.dialog.open(ShareContentDialogComponent, {
      data: this.basketItems,
      autoFocus: false
    });

    const instance = dialogRef.componentInstance;
    instance.title = 'Download content';

  }

  public clearBasket(): void {
    this.basketService.clearBasket();
  }

  public trackByBasket(index, basket: string): string {
    return basket;
  }

  ngOnInit() {
    this.configActions = this.pictureParkUIConfig['BasketComponent'];
  }

}
