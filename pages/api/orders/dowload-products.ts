import { container } from 'tsyringe';
import { Request, Response } from 'express';
import OrderService from '../../../src/services/OrderService';
import PDFDocument from 'pdfkit-table';

interface Product {
	code: string;
	seller: string;
	nombreProducto: string;
	qty: number;
}

export default async function getProductsByProducer(req: Request, res: Response) {
	const orderService = container.resolve(OrderService);

	try {
		const { saleId } = req.query;
		const orderBySaleStatus = await orderService.getOrderBySale(saleId.toString());
		const productosPorProductor: Record<string, Product[]> = {};

		orderBySaleStatus.forEach(orden => {
			orden.products.forEach(producto => {
				const { code, seller, name: nombreProducto, qty } = producto;

				if (productosPorProductor[seller]) {
					productosPorProductor[seller].push({ code, seller, nombreProducto, qty });
				} else {
					productosPorProductor[seller] = [{ code, seller, nombreProducto, qty }];
				}
			});
		});

		const doc = new PDFDocument({
			size: 'letter',
			margins: { top: 72, right: 72, bottom: 72, left: 72 }
		});

		for (const vendedor in productosPorProductor) {
			if (productosPorProductor.hasOwnProperty(vendedor)) {
				const productos = productosPorProductor[vendedor];

				doc.addPage().fontSize(16).font('Helvetica-Bold').text(`Productos de ${vendedor}`, { align: 'center' });

				const table = {
					headers: ['Vendedor', 'Nombre del producto', 'Cantidad'],
					rows: productos.map(producto => [producto.seller, producto.nombreProducto, producto.qty.toString()])
				};
				doc
					.moveDown()
					.table(table, {
						width: 600,
						prepareHeader: () => doc.font('Helvetica-Bold').fontSize(15),
						prepareRow: () => doc.font('Helvetica').fontSize(10),
						columnsSize: [200, 200, 100]
					});
			}
		}

		doc.pipe(res);
		doc.end();

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');
	} catch (error) {
		console.log(error, 'Error al imprimir el pdf');
		res.status(500).json(error);
	}
}
