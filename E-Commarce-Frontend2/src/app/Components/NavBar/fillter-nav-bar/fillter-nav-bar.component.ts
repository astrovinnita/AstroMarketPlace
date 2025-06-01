import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../Common/Services/Backend/api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../Common/Services/storage.service';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fillter-nav-bar',
  standalone: true,
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './fillter-nav-bar.component.html',
  styleUrl: './fillter-nav-bar.component.css'
})
export class FillterNavBarComponent implements OnInit {

  sortJson: any = {
    "Price (Lowest First)": true,
    "Price (Higest First)": false,
    "Relevence": "null"
  }

  fillterForm: any = this.formBuilder.record({
    isAscending: "Relevence",
    productName: null,
    minPrice: [0, Validators.min(200)],
    maxPrice: [0, Validators.max(5000)],
    productCategory: "All",
    selected: { isAscending: "Relevence", productCategory: "All" }
  })

  listJson: any = {}
  storage = inject(StorageService)

  constructor(private apiServices: ApiService, private _bottomSheet: MatBottomSheet, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.getCategories()
    this.listJson.isAscending = Object.keys(this.sortJson)
    this.listJson.range = ["100-200", "200-300", "300-400", "400-500", "500-1000", "1000-2000", "2000-3000", "3000-4000"]
  }

  getCategories() {
    this.apiServices.getProductCategories().subscribe((res: any) => {
      this.listJson.productCategory = res
      if (!this.listJson.productCategory.includes("All"))
        this.listJson.productCategory.push('All')

    })
  }

  openBottomSheet(current: any): void {

    let val = this.listJson[current]

    this._bottomSheet.open(BottomSheetComponent, { data: { value: val, fillterForm: this.fillterForm, current: current } }).afterDismissed().subscribe((res: any) => {

      if (res) {
        this.fillter()
      }

    });
  }


  onSelectionChange(event: any, current: any) {
    this.fillterForm.get(current)?.setValue(event.source.selectedOptions.selected[0].value)
    let selected: any = this.fillterForm.get('selected')?.value
    selected[current] = event.source.selectedOptions.selected[0].value
    this.fillterForm.get('selected')?.setValue(selected)    

    this.fillter()
  }

  fillter() {
    let fillter: any = {}

    if (this.fillterForm.value.isAscending != "Relevence")
      fillter.isAscending = this.sortJson[this.fillterForm.value.isAscending]

    if (this.fillterForm.value.productCategory != "All")
      fillter.productCategory = this.fillterForm.value.productCategory

    if (this.fillterForm.value.minPrice != 0 && this.fillterForm.value.maxPrice != 0) {
      fillter.minPrice = this.fillterForm.value.minPrice
      fillter.maxPrice = this.fillterForm.value.maxPrice
    }

    this.storage.getFillter().pipe(take(1)).subscribe((res: any) => {
      res.isAscending = fillter.isAscending
      res.productCategory = fillter.productCategory
      res.minPrice = fillter.minPrice
      res.maxPrice = fillter.maxPrice
      
      this.storage.setFillter(res)
    })
  }


}
