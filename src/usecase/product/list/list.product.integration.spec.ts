import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import { OutputListProductDto } from "./list.product.dto";

describe("Test list product use case", () => {
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

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("123", "Test Product 1", 100);
        const product2 = new Product("456", "Test Product 2", 200);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const input = {};

        const output: OutputListProductDto = {
            products: [
                {
                    id: "123",
                    name: "Test Product 1",
                    price: 100
                }, {
                    id: "456",
                    name: "Test Product 2",
                    price: 200
                }
            ],
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});
