export interface WhereCondition {
  cond: string;
  params: any;
}

export interface AndConditionList {
  allOf: Array<WhereCondition | OrConditionList>;
}

export interface OrConditionList {
  anyOf: Array<WhereCondition | AndConditionList>;
}

export interface ReturnMessageInfo {
  message: string;
}
