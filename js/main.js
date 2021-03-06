(function($) {
	"use strict"

	// Mobile Nav toggle
	$('.menu-toggle > a').on('click', function (e) {
		e.preventDefault();
		$('#responsive-nav').toggleClass('active');
	})

	// Fix cart dropdown from closing
	$('.cart-dropdown').on('click', function (e) {
		e.stopPropagation();
	});

	/////////////////////////////////////////

	// Products Slick
	$('.products-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
			responsive: [{
	        breakpoint: 991,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1,
	        }
	      },
	    ]
		});
	});

	// Products Widget Slick
	$('.products-widget-slick').each(function() {
		var $this = $(this),
				$nav = $this.attr('data-nav');

		$this.slick({
			infinite: true,
			autoplay: true,
			speed: 300,
			dots: false,
			arrows: true,
			appendArrows: $nav ? $nav : false,
		});
	});

	/////////////////////////////////////////

	// Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}

	/////////////////////////////////////////

	// Input number
	$('.input-number').each(function() {
		var $this = $(this),
		$input = $this.find('input[type="number"]'),
		up = $this.find('.qty-up'),
		down = $this.find('.qty-down');

		down.on('click', function () {
			var value = parseInt($input.val()) - 1;
			value = value < 1 ? 1 : value;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})

		up.on('click', function () {
			var value = parseInt($input.val()) + 1;
			$input.val(value);
			$input.change();
			updatePriceSlider($this , value)
		})
	});

	var priceInputMax = document.getElementById('price-max'),
			priceInputMin = document.getElementById('price-min');

	// Wrapping the inputs

	if(priceInputMax){
		priceInputMax.addEventListener('change', function(){
			updatePriceSlider($(this).parent() , this.value)
		});
	}

	if (priceInputMin){
		priceInputMin.addEventListener('change', function(){
			updatePriceSlider($(this).parent() , this.value)
		});
	}

	function updatePriceSlider(elem , value) {
		if ( elem.hasClass('price-min') ) {
			console.log('min')
			priceSlider.noUiSlider.set([value, null]);
		} else if ( elem.hasClass('price-max')) {
			console.log('max')
			priceSlider.noUiSlider.set([null, value]);
		}
	}

	// Price Slider
	var priceSlider = document.getElementById('price-slider');
	if (priceSlider) {
		noUiSlider.create(priceSlider, {
			start: [1, 999],
			connect: true,
			step: 1,
			range: {
				'min': 1,
				'max': 999
			}
		});

		priceSlider.noUiSlider.on('update', function( values, handle ) {
			var value = values[handle];
			handle ? priceInputMax.value = value : priceInputMin.value = value
		});
	}



	///////////////////////////<<<Cart Fn>>>//////////////////////////////////

	// Remove From Cart fn 
	let removeItem = $('.delete');
	for (let i = 0; i < removeItem.length; i++) {
		const deleteItem = removeItem[i];
		deleteItem.addEventListener('click', removeFromCart);	
	}
	function removeFromCart(event) {
		let deleteButtonClicked = event.target;
		deleteButtonClicked.parentElement.parentElement.remove();
		var circle = document.getElementsByClassName('counter')[1].textContent;
		 circle--;
		 document.getElementsByClassName('counter')[1].textContent = circle;
		 document.getElementById('num').textContent = circle + " Item(s) selected"
		 updateCartTotal();

	};



	// Add To Cart fn
	let addItem = $('.add-to-cart-btn');
	for (let i = 0; i < addItem.length; i++) {
		const addToCart = addItem[i];
		addToCart.addEventListener('click', (event) => {
			let addButtonClicked = event.target;
			let shopItem = addButtonClicked.parentElement.parentElement;
			let productName = $($(shopItem)).find('.product-name')[0].innerText;
			let productPrice = $($(shopItem)).find('.product-price')[0].innerText;
			let imgSrc = $($(shopItem)).find('img')[0].src;

			function addItemToCart(productName, productPrice, imgSrc) {
				let cartRow = document.createElement('div');
				cartRow.classList.add('.cart-list');
				let cartList = $('.cart-list')[0];
				let cartRowContents = `
						<div class="product-widget">	
							<div class="product-img">
								<img src="${imgSrc}" alt="">
							</div>
							<div class="product-body">
								<h3 class="product-name"><a href="#">${productName}</a></h3>
								<h4><span class="product-price"><input type="number" value="1" class="qty" style="width: 40px;"><span class="product-price">${productPrice}</span></h4>
							</div>
							<button class="delete"><i class="fa fa-close"></i></button>
						</div>`;
				cartRow.innerHTML = cartRowContents;
				cartList.append(cartRow);
				cartRow.getElementsByClassName('delete')[0].addEventListener('click', removeFromCart);

				//cart counter
				var circle = document.getElementsByClassName('counter')[1].textContent;
				circle++
				document.getElementsByClassName('counter')[1].textContent = circle
				document.getElementById('num').textContent = circle + " Item(s) selected";
				//preventing negative inputs
				var inputqty = document.getElementsByClassName('qty');
				for(let i = 0; i < inputqty.length; i++){
					var increase = inputqty[i]
					increase.addEventListener('change', increaseQty)
				}
				updateCartTotal()
			}
			addItemToCart(productName, productPrice, imgSrc);

			// Checking if item is already added to cart
			let cartItemNames = shopItem.getElementsByClassName('product-name');
			for (let i = 0; i < cartItemNames.length; i++) {
				if (cartItemNames[i] === productName) {
					alert('This item has been added to the cart');
				}
			}
		});
	}

	 //Fn for preventing nagative input in Qty
	 function increaseQty(e){
		var input = e.target;
		if(isNaN(input.value) || input.value <= 0){
			input.value = 1
		}
		updateCartTotal()
		}

	// Update Cart Total
	function updateCartTotal() {
		var cartDropDown = document.getElementsByClassName("cart-dropdown")[0];
	    var cartlist = cartDropDown.getElementsByClassName("cart-list")[0];
		var productWidget = cartlist.getElementsByClassName("product-widget");
		var sum = 0;
		for (var i = 0; i < productWidget.length; i++){
			var productcontainer = productWidget[i]
			var productPrice = productcontainer.getElementsByClassName("product-price")[1];
			var productQty = productcontainer.getElementsByClassName("qty")[0];
			var price = productPrice.textContent.replace("N", '');
			var quantity = productQty.value;
			sum = sum + (price * quantity)
		}
		document.getElementsByClassName("sum")[0].textContent = "TOTAL: N " + sum;
	}
	updateCartTotal();
	////////////////////////////<<<End Of Cart Fn>>>///////////////////////////

})(jQuery);
