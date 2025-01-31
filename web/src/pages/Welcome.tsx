/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { Typography } from "antd"
import { FormattedMessage } from "umi"

import { GenericArticle, GenericTag } from "@/components/Article/data"
import { Article } from "@/components/Article"
import * as innService from "@/services/inn"

const getArticles = (pagination?: [number, number]) =>
  innService.getLatestUpdate(pagination) as Promise<GenericArticle[]>

const getArticlesCount = () =>
  innService.getUpdateCount()

const getTags = () =>
  innService.getAllTag() as Promise<GenericTag[]>

const modifyArticle = (v: GenericArticle) =>
  innService.saveUpdate(v as InnAPI.Update)

const deleteArticle = (v: string) =>
  innService.deleteUpdate(v)

const modifyTags = (v: GenericTag[]) =>
  innService.modifyTags(v as InnAPI.Tag[])


export default () =>
  <Typography>
    <Typography.Title>
      <FormattedMessage id="pages.welcome.title1" />
    </Typography.Title>

    <Article
      getArticles={getArticles}
      getArticlesCount={getArticlesCount}
      getTags={getTags}
      modifyArticle={modifyArticle}
      deleteArticle={deleteArticle}
      modifyTags={modifyTags}
    />
  </Typography>

