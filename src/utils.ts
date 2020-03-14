interface success {
  success: true
  data: any
}
interface failure {
  success: false
  reason: string
}

export const successResponse = (data: any): success => ({
  success: true,
  data,
});

export const failureResponse = (reason: string): failure => ({
  success: false,
  reason,
});