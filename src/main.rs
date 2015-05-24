#[macro_use] extern crate nickel;
extern crate hyper;

use std::io::Read;

use hyper::Client;
use hyper::header::Connection;
use hyper::error::Error;

use nickel::{Nickel, HttpRouter, QueryString, StaticFilesHandler};
use nickel::status::StatusCode;

fn main() {
    let mut server = Nickel::new();

    fn get_service(url: &str) -> Result<String, Error> {
        let mut client = Client::new();

        let mut res = try!(client.get(url)
                .header(Connection::close())
                .send());

        if res.status.is_success() {
            let mut body = String::new();
            try!(res.read_to_string(&mut body));
            Ok(body)
        } else {
            Err(Error::Status)
        }
    }

    server.get("/api/service", middleware! { |request, response|
        let q = request.query();

        match q.get(&"url".to_string()) {
            Some(url) => {
                match get_service(url) {
                    Ok(body) => {
                        (StatusCode::Ok, body)
                    },
                    Err(err) => {
                        (StatusCode::NotFound, err.to_string())
                    },
                }
            },
            None => (StatusCode::BadRequest, 
                     "Missing query parameter: url".to_string()),
        }
    });
    
    server.utilize(StaticFilesHandler::new("assets"));
    
    server.listen("127.0.0.1:6767");
}

