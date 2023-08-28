import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import ProductService from '../../../src/services/ProductService';
import toObjet from '../../../src/helpers/toObjet';

export default async function getProducts(req: Request, res: Response) {
	const productosService = container.resolve(ProductService);
	try {
		const productosResponse = await productosService.getAllProducts();

		const productos = toObjet(productosResponse)
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Productos');
		const columns = Object.keys(productos[0]).filter(key => key !== '__v');
		worksheet.columns = columns.map(column => ({
			header: column.toUpperCase(),
			key: column,
			width: 15
		}));

		productos.forEach(item => {
			const row = {};
			columns.forEach(column => {	
				row[column] = item[column] === null ? "" : item[column].toString();
			});
			worksheet.addRow(row);
		});

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename=productos.csv');

		workbook.csv.write(res).then(() => {
			res.end();
		});
	} catch (error) {
		console.log(error, 'Error al descargar el csv de los productos');
		res.status(500).json(error);
	}
}
