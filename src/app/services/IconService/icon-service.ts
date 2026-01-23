import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/add.svg'));

    iconRegistry.addSvgIcon(
      'auto_awesome',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/auto_awesome.svg')
    );

    iconRegistry.addSvgIcon(
      'auto_stories',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/auto_stories.svg')
    );
    iconRegistry.addSvgIcon('book', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/book.svg'));
    iconRegistry.addSvgIcon('cached', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/cached.svg'));
    iconRegistry.addSvgIcon(
      'local_library',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/local_library.svg')
    );
    iconRegistry.addSvgIcon(
      'music_note',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/music_note.svg')
    );
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/search.svg'));
    iconRegistry.addSvgIcon(
      'wand_shine',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/wand_shine.svg')
    );
  }
}
