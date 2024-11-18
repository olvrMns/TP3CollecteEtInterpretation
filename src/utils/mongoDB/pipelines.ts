import { PipelineStage } from "mongoose"

export enum PipelineID {
    PRODUCTS_BY_CATEGORY
}

export const pipelines: {[key in PipelineID]: PipelineStage[]} = {
    [PipelineID.PRODUCTS_BY_CATEGORY]: [{$match: {"category":"men's clothing"}}]
}