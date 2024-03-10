import React, { useCallback, useRef, useState } from "react";
import { Box, Heading, Button, TextInput, Layer, FormField, Form, Select, Image, TextArea } from "grommet";
import { useImmer } from "use-immer";
import constants from "../../utils/constants.json"
import FileUpload from "../../components/FileUpload";
import { useAddDishMutation } from "../../services/api";
import useToastService from "../../components/ToastService"
import IngredientsAdd from "./Ingredients";

const initialDishState = {
    name: "",
    ingredients: [],
    description: "",
    dish_type: constants.DISH_TYPE[0],
    food_for: constants.FOOD_FOR[0],
    photo: "",
};

function AddDish({ onClose }) {
    const [dishForm, setDishForm] = useImmer(initialDishState);

    const [addDish, { isLoading, isError }] = useAddDishMutation();
    const { ToastContainer, toastError } = useToastService();
    const ingredientsRef = useRef()


    const handleFieldChange = useCallback((fieldName) => ((event) => {
        setDishForm(draft => {
            draft[fieldName] = event.target.value
        })
    }), [setDishForm])

    const handleSubmit = useCallback(async () => {
        const ingredients = ingredientsRef.current.getIngredients()
        setDishForm(draft=>{
            draft.ingredients = ingredients
        })
        const updatedDishForm = {...dishForm,ingredients:ingredients}
        const res = await addDish(updatedDishForm);
        if (res.error != null) {
            console.log("err:", res.error)
            toastError(res?.error?.data?.message || res?.error?.error)
            return
        }
        onClose()
    }, [addDish, dishForm, onClose, setDishForm, toastError])

    return (
        <Layer
        // onEsc={onClose}
        // onClickOutside={onClose}
        >
            <ToastContainer />
            <Box pad="small" align="center" width={"60vw"} round="small" overflow="scroll">
                <Heading level={3}>Add Dish</Heading>
                <Form>
                    <Box direction="row" align="space" gap="small">
                        <FormField name="name">
                            <TextInput
                                placeholder="name"
                                name="name"
                                value={dishForm.name}
                                onChange={handleFieldChange("name")}
                            />
                        </FormField>
                        <FormField name="cuisine_type">
                            <Select
                                options={constants.DISH_TYPE}
                                value={dishForm.dish_type}
                                size="small"
                                name="dish_type"
                                onChange={({ option }) => setDishForm(draft => { draft.dish_type = option })}
                            />
                        </FormField>
                    </Box>
                    <Box direction="row" align="space" gap="small">
                        <FormField name="Price">
                            <TextArea
                                placeholder="Description"
                                name="description"
                                value={dishForm.description}
                                onChange={handleFieldChange("description")}
                            />
                        </FormField>
                    </Box>
                    <Box direction="row" align="space" gap="small" >
                        <FormField name="food_for">
                            <Select
                                options={constants.FOOD_FOR}
                                value={dishForm.food_for}
                                name="food_for"
                                size="small"
                                onChange={({ option }) => setDishForm(draft => { draft.food_for = option })}
                            />
                        </FormField>
                    </Box>
                    <IngredientsAdd ref={ingredientsRef}  enableEdit={true} />
                    <Box margin={{ top: "medium" }}>
                        <FileUpload onUpload={(url) => setDishForm(draft => { draft.photo = url })} />
                        <Image width="50%" height="auto" src={dishForm.photo} />
                    </Box>
                    <Box direction="row" gap="small" justify="end" margin={{ top: "xsmall" }} style={{ position: "sticky", bottom: 0 }}>
                        <Button label="Cancel" onClick={onClose} />
                        <Button label="Submit" primary onClick={handleSubmit} />
                    </Box>
                </Form>
            </Box>
        </Layer>
    );
}

export default AddDish;
