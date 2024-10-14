import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import CourseCard from '../components/core/Catalog/CourseCard';
import Footer from '../components/common/Footer';
import { FaFilter } from 'react-icons/fa';

function Catalog() {
    const [loading, setLoading] = useState(false);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const { catalogName } = useParams();
    const [ newCourses, setNewCourses ] = useState(null);

    // Fetch categories to get the categoryId
    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const res = await apiConnector('GET', categories.CATEGORIES_API);
                console.log(res)
                if (res?.data?.success) {
                    const category = res?.data?.data?.find((ct) =>
                        ct.name.split(' ').join('-').toLowerCase() === catalogName
                    );
                    if (category) {
                        setCategoryId(category._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, [catalogName]);

    // Fetch catalog page data after categoryId is set
    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true);
            try {
                const res = await getCatalogPageData(categoryId);
                console.log('----->', res);
                setCatalogPageData(res);
            } catch (error) {
                console.error('Error fetching category details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);


    return (
        <div className="text-white">
            {/* Hero Section */}
            <div className="bg-richblack-800 py-12">
                <div className="container mx-auto px-4">
                    <p className="text-sm text-richblack-300 mb-2">
                        Home / Catalog / 
                        <span className="text-yellow-50">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>
                    <h1 className="text-3xl font-bold mb-4">{catalogPageData?.data?.selectedCategory?.name}</h1>
                    <p className="text-richblack-200 max-w-2xl">{catalogPageData?.data?.selectedCategory?.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Courses to get you started */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Courses to get you started</h2>
                    <div className="flex gap-x-3 mb-4">
                        <button className={`${!newCourses? 'bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md':'bg-richblack-700 text-richblack-50 px-4 py-2 rounded-md'}`}
                        onClick={() => setNewCourses(false)}
                        >Most Popular</button>
                        <button className={`${newCourses? 'bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md':'bg-richblack-700 text-richblack-50 px-4 py-2 rounded-md'}`}
                        onClick={() => setNewCourses(true)}
                        >New</button>
                    </div>
                    <CourseSlider Courses={ !newCourses ? catalogPageData?.data?.selectedCategoryPopularCourses : catalogPageData?.data?.selectedCategoryNewCourses} />
                </div>

                {/* Top Courses in Category */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Top Courses in {catalogPageData?.data?.selectedCategory?.name}</h2>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategoryPopularCourses} />
                </div>

                {/* Frequently Bought */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Frequently Bought</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catalogPageData?.data?.topOverallCourses?.slice(0, 6).map((course, index) => (
                            <CourseCard course={course} key={index} />
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-50"></div>
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default Catalog;
