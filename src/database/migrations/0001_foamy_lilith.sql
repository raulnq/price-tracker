CREATE TABLE "price_tracker"."price_histories" (
	"pricehistoryid" uuid PRIMARY KEY NOT NULL,
	"productid" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_tracker"."products" (
	"productid" uuid PRIMARY KEY NOT NULL,
	"storeid" uuid NOT NULL,
	"name" varchar(1024) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"currentprice" numeric(10, 2),
	"pricechangepercentage" numeric(5, 2),
	"lastupdated" timestamp,
	"currency" varchar(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "price_tracker"."price_histories" ADD CONSTRAINT "price_histories_productid_products_productid_fk" FOREIGN KEY ("productid") REFERENCES "price_tracker"."products"("productid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_tracker"."products" ADD CONSTRAINT "products_storeid_stores_storeid_fk" FOREIGN KEY ("storeid") REFERENCES "price_tracker"."stores"("storeid") ON DELETE no action ON UPDATE no action;