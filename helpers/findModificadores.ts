export const findModificadores = (allModificadores, modificadoresIds) => {
    const completeModificadores = [];
    modificadoresIds.forEach(modificadorId => {
        const findCompleteModificador = allModificadores.find(m => m._id.toString() === modificadorId);
        if (findCompleteModificador) {
            completeModificadores.push(findCompleteModificador);
        }
    });
    return completeModificadores;
};