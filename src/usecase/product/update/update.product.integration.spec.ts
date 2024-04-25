import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import { InputUpdateProductDto } from "./update.product.dto";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test update product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const updateUsecase = new UpdateProductUseCase(productRepository);
        const createUsecase = new CreateProductUseCase(productRepository);

        const product = await createUsecase.execute({
            name: "Test Product",
            price: 100.50,
            type: "a",
        });

        const input: InputUpdateProductDto = {
            id: product.id,
            name: "Updated Test Product",
            price: 200.35,
        }

        const result = await updateUsecase.execute(input);

        expect(result).toEqual({
            id: product.id,
            name: input.name,
            price: input.price,
        });
    });
});
