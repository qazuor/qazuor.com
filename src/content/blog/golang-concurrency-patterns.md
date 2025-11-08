---
title: Go Concurrency Patterns with Goroutines and Channels
excerpt:
  Master Go's powerful concurrency primitives and learn essential patterns for
  building concurrent applications with goroutines and channels.
publishDate: 2025-01-17
tags: [Go, Golang, Concurrency, Goroutines, Channels]
readTime: 14 min read
draft: false
---

## Introduction to Go Concurrency

Go's concurrency model is built on goroutines and channels, making concurrent
programming accessible and efficient.

## Basic Goroutines

```go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    time.Sleep(1 * time.Second)
    fmt.Printf("Hello, %s!\n", name)
}

func main() {
    // Launch goroutines
    go sayHello("Alice")
    go sayHello("Bob")
    go sayHello("Charlie")

    // Wait for goroutines to finish
    time.Sleep(2 * time.Second)
    fmt.Println("Done!")
}
```

## Channels for Communication

```go
package main

import "fmt"

func sum(numbers []int, result chan int) {
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    result <- sum // Send result to channel
}

func main() {
    numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

    // Create a channel
    result := make(chan int)

    // Split work between two goroutines
    go sum(numbers[:len(numbers)/2], result)
    go sum(numbers[len(numbers)/2:], result)

    // Receive results
    part1 := <-result
    part2 := <-result

    fmt.Printf("Total sum: %d\n", part1+part2)
}
```

## Worker Pool Pattern

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Job struct {
    id     int
    number int
}

type Result struct {
    job    Job
    result int
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job.id)
        time.Sleep(500 * time.Millisecond)

        // Simulate work - calculate square
        result := Result{
            job:    job,
            result: job.number * job.number,
        }

        results <- result
    }
}

func main() {
    const numWorkers = 3
    const numJobs = 10

    jobs := make(chan Job, numJobs)
    results := make(chan Result, numJobs)

    // Start workers
    var wg sync.WaitGroup
    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- Job{id: j, number: j}
    }
    close(jobs)

    // Wait for all workers to finish
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    for result := range results {
        fmt.Printf("Job %d result: %d\n", result.job.id, result.result)
    }
}
```

## Select Statement

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "one"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "two"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println("Received", msg1)
        case msg2 := <-ch2:
            fmt.Println("Received", msg2)
        case <-time.After(3 * time.Second):
            fmt.Println("Timeout!")
        }
    }
}
```

## Pipeline Pattern

```go
package main

import "fmt"

func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // Set up pipeline
    nums := generator(1, 2, 3, 4, 5)
    squared := square(nums)

    // Consume output
    for n := range squared {
        fmt.Println(n)
    }
}
```

## Conclusion

Go's concurrency model is elegant and powerful. Remember: "Don't communicate by
sharing memory; share memory by communicating!"
