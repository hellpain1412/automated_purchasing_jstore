import { ScanProductUseCase } from "../use-case";

export class ErSportsDomainService {
  private scanProductUseCase = new ScanProductUseCase();
  constructor() {}

  async getProductList() {
    const products = await Promise.all(
      Array.from({ length: 2 }, (_, i) =>
        this.scanProductUseCase.execute(undefined, i + 1)
      )
    );
    return products.flat();
  }
}
