/**
 * Created by Jacob Xie on 9/14/2020.
 */

import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query} from '@nestjs/common'

import {CategoryPureDto} from "../dto"
import * as categoryService from "../provider/category.service"
import {Category, Mark, Tag} from "../entity"


@Controller()
export class CategoryController {
  constructor(private readonly service: categoryService.CategoryService) {}

  @Get("categories")
  getAllCategories() {
    try {
      return this.service.getAllCategories()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("category")
  getCategoryByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("category")
  saveCategory(@Body() category: Category) {
    try {
      return this.service.saveCategory(category)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete("category")
  deleteCategory(@Query("name") name: string) {
    try {
      return this.service.deleteCategory(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ===================================================================================================================

  @Get("getAllCategoriesName")
  getAllCategoriesName() {
    try {
      return this.service.getAllCategoriesName()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getAllCategoriesWithoutContents")
  getAllCategoriesWithoutContents() {
    try {
      return this.service.getAllCategoriesWithoutContents()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryMarkAndTagByName")
  getCategoryMarkAndTagByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryMarkAndTagByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get("getCategoryContentByName")
  getCategoryContentByName(@Query("name") name: string) {
    try {
      return this.service.getCategoryContentByName(name)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategory")
  savePureCategory(@Body() category: CategoryPureDto) {
    try {
      return this.service.saveCategory(category as Category)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryMark")
  saveCategoryMark(@Query("name") name: string,
                   @Body() mark: Mark) {
    try {
      return this.service.saveCategoryMark(name, mark)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post("saveCategoryTag")
  saveCategoryTag(@Query("name") name: string,
                  @Body() tag: Tag) {
    try {
      return this.service.saveCategoryTag(name, tag)
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

