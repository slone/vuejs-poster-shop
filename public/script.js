const PRICE = 9.99;

new Vue({
	el: "#app",
	data: {
		total: 0,
		items: [
		], 
		cart: [],
		newSearch: "elite dangerous",
		lastSearch: "",
		loadingStatus: false,
	},
	methods: {
		onSubmit: function() {
			this.loadingStatus = true;
			this.$http
				.get('/search/'.concat(this.newSearch))
				.then(function(res) {
					this.items = res.data;
					this.lastSearch = this.newSearch;
					this.loadingStatus = false;
				});
		},
		addItem: function(index) {
			this.total += PRICE;
			let item = this.items[index];
			let found = false;
			for(let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === item.id) {
					this.cart[i].qty++;
					found = true;
					break;
				}
			}

			if (!found) {
				this.cart.push({
					id: item.id,
					title: item.title,
					qty: 1,
					price: PRICE
				});
			}
		},
		inc: function(item) {
			item.qty++;
			this.total += item.price;
		},
		dec: function(item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				for (let i=0; i < this.cart.length; i++) {
					if (this.cart[i].id === item.id) {
						this.cart.splice(i, 1);
						break;
					}
				}
			}
		},
	},
	filters: {
		currency: function(price) {
			return "$".concat(price.toFixed(2));
		}
	},
	mounted: function() {
		this.onSubmit();
	}
});