#[macro_use] extern crate nickel;
extern crate hyper;

use std::io::Read;

use hyper::Client;
use hyper::header::Connection;

use nickel::{Nickel, HttpRouter, QueryString, StaticFilesHandler};

fn main() {
    let mut server = Nickel::new();

    server.get("/api/service", middleware! { |request|
        let q = request.query();
        
        let mut body = String::new();

        match q.get(&"url".to_string()) {
            Some(url) => {
                let mut client = Client::new();

                let mut res = client.get(url)
                    .header(Connection::close())
                    .send().unwrap();

                res.read_to_string(&mut body).unwrap();
            },
            None => body = "Missing query parameter: url".to_string(),
        }

        body
    });
    
    server.utilize(StaticFilesHandler::new("assets"));
    
    server.listen("127.0.0.1:6767");
}

