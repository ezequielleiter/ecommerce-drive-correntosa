import { Button, Grid, Image, Input, Text, Textarea } from '@nextui-org/react';
import React from 'react';
import { Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';

const Contacto = () => {
	const SignupSchema = Yup.object().shape({
		nombre: Yup.string().required('Required'),
		asunto: Yup.string().required('Required'),
		email: Yup.string().email('Mail invalido').required('Required'),
		mensaje: Yup.string().required('Required')
	});
	return (
		<Grid className="section" style={{ backgroundColor: '#1b446f', display: 'flex' }}>
			<Grid.Container justify="center" alignContent="center">
				<Grid sm={6} xs={12} alignItems="center" style={{ display: 'flex', flexDirection: 'column' }}>
					<Text h1 color="#E9F1F2">
						Contacto
					</Text>
					<Formik
						initialValues={{
							nombre: '',
							asunto: '',
							email: '',
							mensaje: ''
						}}
						validationSchema={SignupSchema}
						onSubmit={values => {
							// same shape as initial values
							console.log(values);
						}}
					>
						{({ errors, touched, initialValues }) => (
							<Form>
								<Grid.Container gap={2} alignItems="center" justify="center" style={{ display: 'flex' }}>
									{Object.keys(initialValues).map(k => (
										<>
											<Grid xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
												{k === 'mensaje' ? (
													<>
														<Textarea placeholder="Dejanos un mensaje" id="nombre" name={k} width="100%" />
														{errors[k] && touched[k] ? <div>{errors[k]}</div> : null}
													</>
												) : (
													<>
														<Input id="nombre" name={k} placeholder={k} width="100%" />
														{errors[k] && touched[k] ? <div>{errors[k]}</div> : null}
													</>
												)}
											</Grid>
										</>
									))}
									<Button type="submit">Enviar</Button>
								</Grid.Container>
							</Form>
						)}
					</Formik>
				</Grid>
				<Grid sm={6} xs={12} justify="center" style={{ display: "flex", flexDirection: "column"}}>
					<Text h3 color="#E9F1F2">
						Telefono:
					</Text>
					<Text h3 color="#E9F1F2">
						Email:
					</Text>
					<Text h3 color="#E9F1F2" >
						Dirección:
					</Text>
				</Grid>
			</Grid.Container>
		</Grid>
	);
};

export default Contacto;
