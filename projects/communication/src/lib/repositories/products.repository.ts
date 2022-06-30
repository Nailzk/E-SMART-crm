import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpRepository } from "../http";

@Injectable({
    providedIn: 'root'
})
export class ProductsRepository extends HttpRepository<any> {
    get _baseUrl(): string {
        return `${environment.apiUrl}/products`
    }
}