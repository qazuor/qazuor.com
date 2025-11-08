---
title: Advanced SQL Queries and Window Functions
excerpt:
  Master complex SQL queries, window functions, CTEs, and advanced techniques
  for efficient database operations.
publishDate: 2025-01-13
tags: [SQL, Database, PostgreSQL, Data Analysis]
readTime: 13 min read
draft: false
---

## Window Functions Basics

Window functions perform calculations across rows related to the current row.

```sql
-- Basic window function
SELECT
    employee_id,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg_salary,
    salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg
FROM employees;
```

## Ranking Functions

```sql
-- Row number, rank, and dense_rank
SELECT
    product_name,
    category,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) as row_num,
    RANK() OVER (ORDER BY price DESC) as rank,
    DENSE_RANK() OVER (ORDER BY price DESC) as dense_rank,
    NTILE(4) OVER (ORDER BY price DESC) as quartile
FROM products;
```

## Common Table Expressions (CTEs)

```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: Top-level employees
    SELECT
        employee_id,
        name,
        manager_id,
        1 as level,
        CAST(name AS VARCHAR(1000)) as path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case
    SELECT
        e.employee_id,
        e.name,
        e.manager_id,
        eh.level + 1,
        CAST(eh.path || ' -> ' || e.name AS VARCHAR(1000))
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM employee_hierarchy
ORDER BY level, name;
```

## Moving Averages

```sql
-- 7-day moving average
SELECT
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7_days,
    SUM(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as cumulative_revenue
FROM daily_sales
ORDER BY date;
```

## Advanced Joins

```sql
-- LATERAL join (PostgreSQL)
SELECT
    c.customer_name,
    latest_orders.*
FROM customers c
CROSS JOIN LATERAL (
    SELECT order_id, order_date, total
    FROM orders o
    WHERE o.customer_id = c.customer_id
    ORDER BY order_date DESC
    LIMIT 3
) as latest_orders;
```

## Pivoting Data

```sql
-- Transform rows to columns
SELECT
    product_category,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 1 THEN amount ELSE 0 END) as Q1,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 2 THEN amount ELSE 0 END) as Q2,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 3 THEN amount ELSE 0 END) as Q3,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 4 THEN amount ELSE 0 END) as Q4
FROM sales
WHERE EXTRACT(YEAR FROM order_date) = 2024
GROUP BY product_category;
```

## Performance Optimization

```sql
-- Create indexes
CREATE INDEX idx_orders_customer_date
ON orders (customer_id, order_date DESC);

-- Analyze query performance
EXPLAIN ANALYZE
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.total) > 1000
ORDER BY total_spent DESC;
```

## JSON Operations

```sql
-- PostgreSQL JSON operations
SELECT
    id,
    data->>'name' as name,
    data->'address'->>'city' as city,
    jsonb_array_elements_text(data->'tags') as tag
FROM users
WHERE data @> '{"status": "active"}';
```

## Conclusion

Mastering these advanced SQL techniques will significantly improve your data
analysis capabilities and query performance!
