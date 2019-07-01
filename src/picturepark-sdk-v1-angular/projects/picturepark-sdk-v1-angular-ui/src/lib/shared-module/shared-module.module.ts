import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MODULES
import { MaterialsModule } from '../materials-module/materials-module.module';

// SERVICES
import { BasketService } from './services/basket/basket.service';
import { ContentItemSelectionService } from './services/content-item-selection/content-item-selection.service';
import { DownloadFallbackService } from './services/download-fallback/download-fallback.service';
import { LiquidRenderingService } from './services/liquid-rendering/liquid-rendering.service';
import { NotificationService } from './services/notification/notification.service';
import { TranslationService } from './services/translations/translation.service';

// PIPES
import { FileSizePipe } from './pipes/filesize.pipe';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    // PIPES
    FileSizePipe,
    TranslatePipe
  ],
  imports: [
    CommonModule,
    MaterialsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    // PIPES
    FileSizePipe,
    TranslatePipe
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        BasketService,
        ContentItemSelectionService,
        LiquidRenderingService,
        NotificationService,
        DownloadFallbackService,
        TranslationService,
      ]
    };
  }
}
