import {ChangeDetectorRef, Component} from '@angular/core';
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  title?: string;
  activeId: number = 1;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private menuTitleService: MenuTitleService) {
  }

  ngOnInit(): void {
    this.subscribeBehaviors();
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Subscribe all behaviors
   */
  subscribeBehaviors(): void {
    this.menuTitleService.title.subscribe(newTitle => {
      this.title = newTitle;
    });
  }

  navigateToHome(): void {
    console.log(this.activeId);
  }

  navigateToSecond(): void {
    console.log(this.activeId);
  }
}
