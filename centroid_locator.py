# Jasper Henderson
# Centroid Locator
import math


class CentroidLocator:

    def __init__(self):
        self.shapes = []

    # this function adds a shape to the centroid locator
    def add_shape(self, shape):

        computed_shape = {}
        computed_shape_type = computed_shape["type"]

        if computed_shape_type == "triangle":
            computed_shape["area"] = shape["base"] * shape["height"] / 2
            # the shape is negative, so we need to invert its area
            if computed_shape["is_hole"]:
                computed_shape["area"] = -computed_shape["area"]
            computed_shape["x_centroid"] = shape["x_centroid"]
            computed_shape["y_centroid"] = shape["y_centroid"]

        elif computed_shape_type == "rectangle":
            computed_shape["area"] = shape["base"] * shape["height"]
            # the shape is negative, so we need to invert its area
            if computed_shape["is_hole"]:
                computed_shape["area"] = -computed_shape["area"]
            computed_shape["x_centroid"] = shape["x_centroid"]
            computed_shape["y_centroid"] = shape["y_centroid"]

        elif computed_shape_type == "circle":
            computed_shape["area"] = math.pi * shape["radius"] ** 2
            # the shape is negative, so we need to invert its area
            if computed_shape["is_hole"]:
                computed_shape["area"] = -computed_shape["area"]
            computed_shape["x_centroid"] = shape["x_centroid"]
            computed_shape["y_centroid"] = shape["y_centroid"]

        self.shapes.append(computed_shape)

    # this function returns the x and y coordinates of the composite formed from the shapes stored in the function
    def compute_centroid(self):

        area_sum = 0
        x_total_area = 0
        y_total_area = 0

        for shape in self.shapes:
            area_sum += shape["area"]
            x_total_area += shape["area"] * shape["x_centroid"]
            y_total_area += shape["area"] * shape["y_centroid"]

        if area_sum == 0:
            return None
        else:
            x_centroid = x_total_area / area_sum
            y_centroid = y_total_area / area_sum

            return x_centroid, y_centroid
