import React, { useCallback, useState } from "react";
import { Box, Heading, Button, TextInput, Paragraph, Layer, FormField, Form, Select, Text, Image } from "grommet";
import AsyncSelect from "react-select/async";
import { Add, Close, Upload } from "grommet-icons";
import { useImmer } from "use-immer";
import constants from "../../utils/constants.json"
import FileUpload from "../../components/FileUpload";
import PillLabel from "../../components/PilLabel"
import { useAddMealMutation } from "../../services/api";
import useToastService from "../../components/ToastService"
import { doRequest } from "../../utils/requests";
import { selectUser } from "../user/userSlice";
import { useSelector } from "react-redux";


const fetchDishes = async (searchTerm, token) => {
    const result = await doRequest(process.env.REACT_APP_API_BASE_URL + "/dishes?name=" + searchTerm, "GET", {}, {
        "Authorization": `Bearer ${token}`
    })
    return result.response.dishes;
};
const initialMealState = {
    name: "",
    dishes: [],
    price: 10.0,
    food_for: constants.FOOD_FOR[0],
    cuisine_type: constants.CUISINE_TYPES[0],
    timeToCookMins: 15,
    photo: "",
};

function AddMeal({ onClose }) {
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [mealForm, setMealForm] = useImmer(initialMealState);

    const [addMeal, { isLoading, isError }] = useAddMealMutation();
    const { ToastContainer, toastError } = useToastService();
    const user = useSelector(selectUser)

    const loadOptions = async (searchTerm) => {
        const result = await fetchDishes(searchTerm, user.token);
        return result.map((dish) => ({ value: dish.id, label: dish.name }));
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleAddMeal = () => {
        console.log("Selected Dishes:", selectedDishes);
        setShowModal(false);
    };

    const handleFieldChange = useCallback((fieldName) => ((event) => {
        setMealForm(draft => {
            draft[fieldName] = event.target.value
        })
    }), [setMealForm])

    const handleSubmit = useCallback(async () => {
        const updatedForm = {...mealForm,dishes:selectedDishes.map(dish=>dish.value)}
        const res = await addMeal(updatedForm);
        if (res.error != null) {
            console.log("res:", res.error)
            toastError(res?.error?.data?.message || res?.error?.error)
            return
        }
        onClose()
    }, [addMeal, mealForm, onClose, selectedDishes, toastError])

    return (
        <Layer
        // onEsc={onClose}
        // onClickOutside={onClose}
        >
            <ToastContainer />
            <Box pad="small" align="center" width={"60vw"} round="small" overflow="scroll">
                <Heading level={3}>Add Meal</Heading>
                <Form>
                    <Box direction="row" align="space" gap="small">
                        <FormField name="name">
                            <TextInput
                                placeholder="name"
                                name="name"
                                value={mealForm.name}
                                onChange={handleFieldChange("name")}
                            />
                        </FormField>
                        <FormField name="cuisine_type">
                            <Select
                                options={constants.CUISINE_TYPES}
                                value={mealForm.cuisine_type}
                                size="small"
                                name="cuisine_type"
                                onChange={({ option }) => setMealForm(draft => { draft.cuisine_type = option })}
                            />
                        </FormField>
                    </Box>
                    <Box direction="row" align="space" gap="small">
                        <FormField name="Price">
                            <TextInput
                                placeholder="Price"
                                name="price"
                                value={mealForm.price}
                                onChange={handleFieldChange("price")}
                            />
                        </FormField>
                        <FormField name="time_to_cook">
                            <Select
                                options={[15, 30, 45, 60, 90, 120]}
                                value={mealForm.timeToCookMins}
                                defaultValue={15}
                                size="small"
                                name="time_to_cook"
                                onChange={({ option }) => setMealForm(draft => { draft.timeToCookMins = option })}
                            />
                        </FormField>
                    </Box>
                    <Box direction="row" align="space" gap="small" >
                        <FormField name="food_for">
                            <Select
                                options={constants.FOOD_FOR}
                                value={mealForm.food_for}
                                name="food_for"
                                size="small"
                                onChange={({ option }) => setMealForm(draft => { draft.food_for = option })}
                            />
                        </FormField>
                    </Box>
                    <Box margin={{ top: "medium" }}>
                        <Button icon={<Add />} label="Dishes" onClick={() => setShowModal(true)} />
                        {showModal && (
                            <Layer
                                position="center"
                                onClickOutside={handleClose}
                                onEsc={handleClose}
                            >
                                <Button
                                    icon={<Close />}
                                    onClick={handleClose}
                                    style={{ position: "absolute", top: "0px", right: 0 }}
                                />
                                <Box width="400px" pad="medium" margin={{ top: "medium" }}>
                                    <AsyncSelect
                                        isMulti
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={loadOptions}
                                        onChange={(selectedOptions) =>
                                            setSelectedDishes((prev) => {
                                                const uniqueValues = new Set(prev.map((dish) => dish.value));
                                                const newOptions = selectedOptions.filter((option) => !uniqueValues.has(option.value));
                                                return [...prev, ...newOptions];
                                            })
                                        }
                                    />
                                    <Box margin={{ top: "small" }}>
                                        {selectedDishes.map((dish) => (
                                            <Paragraph key={dish.value}>{dish.label}</Paragraph>
                                        ))}
                                    </Box>
                                    <Box align="end" margin={{ top: "medium" }}>
                                        <Button
                                            label="Add"
                                            primary
                                            onClick={handleAddMeal}
                                            margin={{ top: "xsmall" }}
                                            style={{ position: "absolute", bottom: "5px" }}
                                        />
                                    </Box>
                                </Box>
                            </Layer>
                        )}
                        <Box direction="row" style={{ flexWrap: "wrap", maxWidth: "40vw", width: "max-content" }} >
                            {selectedDishes.map(dish => <PillLabel key={dish.value} id={dish.value} onClose={(id) => setSelectedDishes(selectedDishes.filter(dish => dish.value !== id))} label={dish.label} />)}
                        </Box>
                        <FileUpload onUpload={(url) => setMealForm(draft => { draft.photo = url })} />
                        <Image width="50%" height="auto" src={mealForm.photo} />
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


export default AddMeal;
