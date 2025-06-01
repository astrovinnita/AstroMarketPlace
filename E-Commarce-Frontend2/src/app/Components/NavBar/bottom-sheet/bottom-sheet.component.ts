import { Component, Inject } from '@angular/core';
import { FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [FormsModule, MatListModule, MatChipsModule,MatButtonModule],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.css'
})
export class BottomSheetComponent {

  constructor(@Inject(MatBottomSheetRef) private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) { }

  fillterForm!: FormRecord;
  data: any

  minPrice: any = 1000;
  maxPrice: any = 3000;

  ngOnInit(): void {
    this.data = this.bottomSheetRef?.containerInstance?._config?.data

    this.fillterForm = this.data.fillterForm
    if (this.data.current == 'range') {
      this.minPrice = this.fillterForm.get('minPrice')?.value
      this.maxPrice = this.fillterForm.get('maxPrice')?.value
    }
  }

  openLink(event: any): void {
    this.bottomSheetRef.dismiss(event);
  }


  onSelectionChange(event: any) {

    this.fillterForm.get(this.data.current)?.setValue(event.source.selectedOptions.selected[0].value)
    let selected = this.fillterForm.get('selected')?.value
    selected[this.data.current] = event.source.selectedOptions.selected[0].value
    this.fillterForm.get('selected')?.setValue(selected)    

    this.openLink(true)

  }

  async apply() {
    let val: any[] = []

    this.fillterForm.get('selected')?.value[this.data.current].forEach((v: any) => {
      val.push(...v.split("-"))
    })

    val = val.map(v=>parseInt(v))

    val = val.sort((a, b) => a - b)

    this.fillterForm.get('minPrice')?.setValue(parseInt(val[0]))
    this.fillterForm.get('maxPrice')?.setValue(parseInt(val[val?.length - 1]))

    this.openLink(true)
  }


}
