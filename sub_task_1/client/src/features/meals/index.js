import React, { useState } from 'react'
import ListMeals from './ListMeals'
import { Box, Button, Nav } from 'grommet'
import { Add, LinkNext } from 'grommet-icons'
import AddMeal from './AddMeal'
import { useNavigate } from 'react-router-dom'
import constants from "../../utils/constants.json"
import "./meal.css"

const Meals = ({ rolesSet }) => {
  const [openAddMeal, setOpenAddMeal] = useState(false)
  const navigate = useNavigate()

  return (
    <Box>
      <Nav className="meal_navbar" pad={{ vertical: "small" }} style={{ position: "sticky", top: "8px" }} justify="center" direction="row">
        {rolesSet.has(constants.ROLES.MANAGER) && <Box width={"small"} >
          <Button icon={<Add />} onClick={() => setOpenAddMeal(true)} color="#81e094" primary label="Add meal" />
        </Box>
        }
        {openAddMeal && <AddMeal onClose={() => setOpenAddMeal(false)} />}
        <Box width={"small"} >
          <Button icon={<LinkNext />} onClick={() => navigate("/dishes")} color="#81e094" primary label="Dishes" />
        </Box>
      </Nav>
      <ListMeals isManager={rolesSet.has(constants.ROLES.MANAGER)}/>
    </Box>
  )
}

export default Meals