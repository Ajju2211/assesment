import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Box, Button, DataTable, Form, FormField, Select, Text, TextInput } from 'grommet';
import useToastService from '../../components/ToastService';
import constants from "../../utils/constants.json"
import { Close } from 'grommet-icons';

const AddIngredientPopup = ({ onAddIngredient, units }) => {
    const [ingredient, setIngredient] = useState({
        quantity: 0,
        units: units[0],
        name: '',
    });

    const handleInputChange = (key, value) => {
        setIngredient((prevIngredient) => ({ ...prevIngredient, [key]: value }));
    };

    const handleAddIngredient = () => {
        onAddIngredient({ ...ingredient, quantity: parseFloat(ingredient.quantity) });
        setIngredient({ quantity: 0, units: units[0], name: '' });
    };

    return (
        <Box direction="row">
            <Form>
                <Box direction="row" gap="small">
                    <FormField label="Ingredient Name">
                        <TextInput
                            value={ingredient.name}
                            onChange={(event) => handleInputChange('name', event.target.value)}
                        />
                    </FormField>
                    <FormField label="Quantity">
                        <TextInput
                            type="number"
                            min={0}
                            defaultValue={0}
                            value={ingredient.quantity}
                            onChange={(event) => handleInputChange('quantity', event.target.value)}
                        />
                    </FormField>
                    <FormField label="Units">
                        <Select
                            options={units}
                            value={ingredient.units}
                            onChange={({ option }) => handleInputChange('units', option)}
                        />
                    </FormField>
                </Box>
                <Box direction="row" justify="end">
                    <Button primary label="Add" onClick={handleAddIngredient} />
                </Box>
            </Form>
        </Box>
    );
};

const IngredientList = ({ ingredients, onDeleteIngredient, enableEdit }) => {
    const columns = [
        {
            property: 'name',
            header: 'Ingredient Name',
            primary: true,
        },
        {
            property: 'quantity',
            header: 'Quantity',
        },
        {
            property: 'units',
            header: 'Unit',
        }
    ];
    if (enableEdit) {
        columns.push({
            property: 'delete',
            header: 'Remove',
            render: (ingredient) => (
                <Button icon={<Close />} onClick={() => onDeleteIngredient(ingredient)} />
            ),
        },)
    }

    return (
        <DataTable
            columns={columns}
            data={ingredients}
            step={10}
            alignSelf="center"
        >
            {(props) => (
                <Box {...props}>
                    <Box direction="row" align="center" gap="small">
                        {columns.map((column) => (
                            <Box key={column.property} flex={column.property !== 'quantity' ? 'grow' : false}>
                                <Text weight="bold">{column.header}</Text>
                            </Box>
                        ))}
                    </Box>
                    {props.data.map((ingredient, index) => (
                        <Box
                            key={index}
                            direction="row"
                            align="center"
                            border={index < props.data.length - 1 ? { side: 'bottom', color: 'border' } : undefined}
                            pad={{ vertical: 'small' }}
                        >
                            {columns.map((column) => (
                                <Box key={column.property} flex={column.property !== 'quantity' ? 'grow' : false}>
                                    <Text>{ingredient[column.property]}</Text>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            )}
        </DataTable>
    );
};




const IngredientsAdd = React.forwardRef(({ defaultIngredients = [], enableEdit = false }, ref) => {
    const [ingredients, setIngredients] = useState(defaultIngredients);
    const units = constants.UNITS;

    const { ToastContainer, toastError } = useToastService();

    const handleAddIngredient = (ingredient) => {
        const newIngredient = {
            quantity: parseFloat(ingredient.quantity),
            units: ingredient.units,
            name: ingredient.name.trim(),
        };

        if (ingredients.some(existingIngredient => existingIngredient.name === newIngredient.name)) {
            toastError(`Ingredient '${newIngredient.name}' already added`)
            return;
        }

        setIngredients([...ingredients, newIngredient]);
    };
    useImperativeHandle(ref, () => ({
        getIngredients: () => ingredients,
    }));

    return (

        <Box align="center" justify="center" pad="small">
            <ToastContainer />
            {enableEdit && <AddIngredientPopup onAddIngredient={handleAddIngredient} units={units} />}
            <Box style={{ maxHeight: "50vh", overflow: "scroll" }}>
                <IngredientList ingredients={ingredients} enableEdit={enableEdit} onDeleteIngredient={(ing) => setIngredients(ingredients.filter(i => i.name !== ing.name))} />
            </Box>
        </Box>
    );
});

export default IngredientsAdd;
