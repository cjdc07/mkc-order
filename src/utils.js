export const formatCurrency = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
}).format(value)

export const formatDate = (date) => new Date(date).toLocaleString("en", {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
