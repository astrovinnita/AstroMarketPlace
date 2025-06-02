import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { StorageService } from '../../Common/Services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  @ViewChild('productImagesInput') productImagesInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];

  productCategories: any
  colors = ['red', 'green', 'black', 'white']


  private storage: any = inject(StorageService)
  private apiServices = inject(ApiService)
  private snackBar = inject(SnackBarService)
  private rout = inject(Router)

  ngOnInit() {

    this.storage.getUser().subscribe((res: any) => {
      if (res.userRole != "SELLER") {
        this.rout.navigate(['home'])
        this.getCetagorise()
      }
    })
  }

  getCetagorise() {
    this.apiServices.getProductCategories().subscribe(res => this.productCategories = res)
  }

  onImageChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target?.files && target?.files?.length > 0) {
      this.files.push(...Array.from(target.files));
      this.displayPreviews();
    }
  }

  displayPreviews() {
    let preview: any = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(this.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = e.target.result;

        const removeIcon = document.createElement('div');
        removeIcon.className = 'remove-icon';
        removeIcon.textContent = '×';
        removeIcon.addEventListener('click', () => {
          this.removeImage(container, file);
        });

        container.appendChild(img);
        container.appendChild(removeIcon);
        preview.appendChild(container);
      };
      reader.readAsDataURL(file);
      console.log(this.files);

    });
  }

  removeImage(container: HTMLElement, file: File) {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.files.splice(index, 1);
      container.remove();
    }

  }

  submit(addProductForm: any) {
    let val = addProductForm.value
    val.productCategory = { 'productCategoryName': addProductForm.value.productCategory }
    this.apiServices.addProduct(this.files, val).subscribe(() => this.snackBar.successSnackBar("Product Added Succesfully"))
  }
}

