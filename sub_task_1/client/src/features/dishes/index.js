import React, { useCallback, useState } from 'react'
import DishList from './ListDishes'
import { Box, Button, Nav } from 'grommet'
import { Add, LinkNext, LinkPrevious } from 'grommet-icons'
import "./meal.css"
import AddDish from './AddDish'
import constants from "../../utils/constants.json"
import { useNavigate } from 'react-router-dom'

const Dishes = ({ rolesSet }) => {
  const [openAddDish, setOpenAddDish] = useState(false)
  const navigate = useNavigate()
  const isManager = rolesSet.has(constants.ROLES.MANAGER)

  return (
    <Box>
      <Nav className="meal_navbar" pad={{ vertical: "small" }} style={{ position: "sticky", top: "8px" }} justify="center" direction="row">
        <Box width={"small"} >
          <Button icon={<LinkPrevious />} onClick={() => navigate("/meals")} color="#81e094" primary label="Meals" />
        </Box>
        {openAddDish && <AddDish onClose={() => setOpenAddDish(false)} />}
        {isManager && <Box width={"small"} >
          <Button icon={<Add />} onClick={() => setOpenAddDish(true)} color="#81e094" primary label="Add Dish" />
        </Box>
        }
      </Nav>
      <DishList isManager={isManager} />
    </Box>
  )
}

export default Dishes