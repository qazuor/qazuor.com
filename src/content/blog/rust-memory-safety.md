---
title: Rust's Ownership System and Memory Safety
excerpt:
  Understanding Rust's unique approach to memory management through ownership,
  borrowing, and lifetimes without a garbage collector.
publishDate: 2025-01-16
tags: [Rust, Memory Safety, Systems Programming, Ownership]
readTime: 16 min read
draft: false
---

## Why Rust's Ownership System?

Rust achieves memory safety without a garbage collector through its innovative
ownership system.

## Basic Ownership

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2

    // println!("{}", s1); // This would error! s1 is no longer valid
    println!("{}", s2); // Only s2 is valid
}
```

## Borrowing and References

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1); // Borrow s1

    println!("The length of '{}' is {}.", s1, len); // s1 is still valid!
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but doesn't own the data, so nothing happens
```

## Mutable References

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);

    println!("{}", s);
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

## The Rules

```rust
fn main() {
    let mut s = String::from("hello");

    // Can have multiple immutable references
    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);

    // OR one mutable reference
    let r3 = &mut s;
    println!("{}", r3);

    // But NOT both at the same time!
}
```

## Lifetimes

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let string2 = String::from("xyz");

    let result = longest(string1.as_str(), string2.as_str());
    println!("The longest string is {}", result);
}
```

## Struct Lifetimes

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }

    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");

    let i = ImportantExcerpt {
        part: first_sentence,
    };

    println!("Level: {}", i.level());
}
```

## Smart Pointers

```rust
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    // Rc for multiple ownership
    let a = Rc::new(5);
    let b = Rc::clone(&a);
    let c = Rc::clone(&a);

    println!("Reference count: {}", Rc::strong_count(&a));

    // RefCell for interior mutability
    let data = RefCell::new(5);
    *data.borrow_mut() += 1;
    println!("Value: {}", data.borrow());
}
```

## Conclusion

Rust's ownership system is unique and powerful. It prevents data races at
compile time and eliminates entire classes of bugs!
