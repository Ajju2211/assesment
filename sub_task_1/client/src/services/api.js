import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_API_BASE_URL;


const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
});

export const opstechServerAPI = createApi({
  reducerPath: 'opstechServerAPI',
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    tokenValidate: builder.query({
      query: () => "tkn"
    }),
    getMyProfile: builder.query({
      query: () => "me",
    }),
    getAllMeals: builder.query({
      query: ({ limit, skip }) => `/meals?limit=${limit}&skip=${skip}`,
    }),
    getAllDishes: builder.query({
      query: ({ limit, skip }) => `/dishes?limit=${limit}&skip=${skip}`,
    }),
    getMealById: builder.query({
      query: ({ id }) => `/meals/${id}`,
    }),
    getDishById: builder.query({
      query: ({ id }) => `/dishes/${id}`,
    }),
    deleteMeal: builder.mutation({
      query: (mealId) => ({
        url: `meals/${mealId}`,
        method: 'DELETE',
      })
    }),
    deleteDish: builder.mutation({
      query: (dishId) => ({
        url: `dishes/${dishId}`,
        method: 'DELETE',
      })
    }),
    addMeal: builder.mutation({
      query: (data) => ({
        url: "/meals",
        method: 'POST',
        body: data
      })
    }),
    addDish: builder.mutation({
      query: (data) => ({
        url: "/dishes",
        method: 'POST',
        body: data
      })
    }),
  }),
});

export const { useGetMyProfileQuery, useGetAllMealsQuery,
  useDeleteMealMutation, useAddMealMutation,
  useTokenValidateQuery, useAddDishMutation,
  useGetAllDishesQuery,useDeleteDishMutation, useGetMealByIdQuery, useGetDishByIdQuery } = opstechServerAPI